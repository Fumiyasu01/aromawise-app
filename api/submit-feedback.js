// Vercel Function - GitHub Issuesにフィードバックを送信

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, body, labels } = req.body;

    // GitHub Personal Access Tokenを環境変数から取得
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO; // 例: "Fumiyasu01/aromawise-app"

    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      console.error('GitHub設定が不完全です');
      return res.status(500).json({ error: 'GitHub設定が不完全です' });
    }

    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'AromaWise-Feedback-Bot'
      },
      body: JSON.stringify({
        title,
        body,
        labels
      })
    });

    if (response.ok) {
      const issue = await response.json();
      return res.status(200).json({ 
        success: true, 
        issueNumber: issue.number,
        url: issue.html_url 
      });
    } else {
      const error = await response.text();
      console.error('GitHub API エラー:', error);
      return res.status(500).json({ error: 'GitHub Issues作成に失敗しました' });
    }
  } catch (error) {
    console.error('フィードバック送信エラー:', error);
    return res.status(500).json({ error: '内部サーバーエラー' });
  }
}